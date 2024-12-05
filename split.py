import json
from typing import Dict, List
from datetime import datetime

def split_character_data(input_file: str, master_file: str, detail_file: str) -> None:
    """
    Reads character data from input file and splits it into master and detail files.
    
    Args:
        input_file: Path to input JSON file
        master_file: Path to output master JSON file
        detail_file: Path to output detail JSON file
    """
    # Read input file
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Prepare master and detail data structures
    master_data = {
        "info": {
            "count": data["info"]["count"],
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        },
        "results": []
    }
    
    detail_data = {
        "info": {
            "count": data["info"]["count"],
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        },
        "results": []
    }
    
    # Split the data
    for character in data["results"]:
        # Master record - keep only id, name, and image
        master_record = {
            "id": character["id"],
            "name": character["name"],
            "image": character["image"]
        }
        master_data["results"].append(master_record)
        
        # Detail record - keep everything except name and image
        detail_record = {
            "id": character["id"],
            "status": character["status"],
            "species": character["species"],
            "type": character["type"],
            "gender": character["gender"],
            "origin": character["origin"],
            "location": character["location"],
            "url": character["url"],
            "created": character["created"],
            "episode_count": character["episode_count"]
        }
        detail_data["results"].append(detail_record)
    
    # Write output files
    with open(master_file, 'w') as f:
        json.dump(master_data, f, indent=2)
    
    with open(detail_file, 'w') as f:
        json.dump(detail_data, f, indent=2)

if __name__ == "__main__":
    # Example usage
    split_character_data(
        "rick_and_morty_characters.json",
        "characters_master.json",
        "characters_detail.json"
    )