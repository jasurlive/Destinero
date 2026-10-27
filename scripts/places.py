"""Tiny helper for public/data/places.csv

    python python/places.py add "Tokyo, Japan" 35.68,139.76 --type planned --image https://...
    python python/places.py list [--type visited]
"""
import argparse
import csv
from pathlib import Path

CSV = Path(__file__).resolve().parent.parent / "public" / "data" / "places.csv"
FIELDS = ["type", "name", "lat", "lng", "image"]
TYPES = ["visited", "planned", "highlighted"]


def read():
    if not CSV.exists():
        return []
    with CSV.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def add(name, coords, type, image=""):
    lat, lng = (float(c) for c in coords.strip("[] ").split(","))
    new = not CSV.exists()
    with CSV.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, FIELDS)
        if new:
            writer.writeheader()
        writer.writerow({"type": type, "name": name, "lat": lat, "lng": lng, "image": image})
    print(f"added {type}: {name} ({lat}, {lng})")


def main():
    parser = argparse.ArgumentParser(description="Manage Destinero places")
    sub = parser.add_subparsers(dest="cmd", required=True)

    a = sub.add_parser("add", help="add a place")
    a.add_argument("name")
    a.add_argument("coords", help='"lat,lng", e.g. 35.68,139.76')
    a.add_argument("--type", choices=TYPES, default="visited")
    a.add_argument("--image", default="", help="image URL")

    ls = sub.add_parser("list", help="list places")
    ls.add_argument("--type", choices=TYPES)

    args = parser.parse_args()
    if args.cmd == "add":
        add(args.name, args.coords, args.type, args.image)
    else:
        rows = [r for r in read() if not args.type or r["type"] == args.type]
        for r in rows:
            print(f'{r["type"]:<12} {r["name"]:<40} {r["lat"]}, {r["lng"]}')
        print(f"{len(rows)} places")


if __name__ == "__main__":
    main()
