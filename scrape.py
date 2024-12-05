import requests
import json
import time
from typing import List, Dict
from pathlib import Path

def fetch_characters(base_url: str = "https://rickandmortyapi.com/api/character/") -> List[Dict]:
    """
    Fetches all character data from the Rick and Morty API and simplifies episode data to counts.
    
    Args:
        base_url (str): The base URL for the Rick and Morty API character endpoint
        
    Returns:
        List[Dict]: A list of all character dictionaries with simplified episode counts
    """
    all_characters = []
    current_url = base_url
    page = 1
    total_pages = None
    
    while current_url:
        # Add delay to be respectful to the API
        if page > 1:
            time.sleep(0.5)
            
        print(f"Fetching page {page}...")
        
        try:
            response = requests.get(current_url)
            response.raise_for_status()  # Raise an exception for bad status codes
            data = response.json()
            
            # Get total pages on first request
            if total_pages is None:
                total_pages = data['info']['pages']
                print(f"Total pages to fetch: {total_pages}")
            
            # Process characters from current page
            for character in data['results']:
                # Replace episode list with count
                character['episode_count'] = len(character['episode'])
                del character['episode']  # Remove the original episode list
                all_characters.append(character)
            
            # Update URL for next page
            current_url = data['info']['next']
            page += 1
            
            # Print progress
            print(f"Progress: {len(all_characters)} characters collected")
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching page {page}: {e}")
            print("Retrying in 5 seconds...")
            time.sleep(5)
            continue
            
        except Exception as e:
            print(f"Unexpected error: {e}")
            break
    
    return all_characters

def save_to_json(data: List[Dict], filename: str = "rick_and_morty_characters.json"):
    """
    Saves the character data to a JSON file.
    
    Args:
        data (List[Dict]): The character data to save
        filename (str): The name of the output file
    """
    output_path = Path(filename)
    
    try:
        with output_path.open('w', encoding='utf-8') as f:
            json.dump({
                'info': {
                    'count': len(data),
                    'generated_at': time.strftime('%Y-%m-%d %H:%M:%S')
                },
                'results': data
            }, f, indent=2, ensure_ascii=False)
        
        print(f"\nData successfully saved to {output_path.absolute()}")
        print(f"Total characters saved: {len(data)}")
        
    except Exception as e:
        print(f"Error saving data: {e}")

def main():
    """Main function to run the scraper"""
    print("Starting Rick and Morty character data collection...")
    
    characters = fetch_characters()
    
    if characters:
        save_to_json(characters)
    else:
        print("No data was collected. Please check the errors above.")

if __name__ == "__main__":
    main()