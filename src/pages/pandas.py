import pandas as pd

# Sample data for the columns
data = [
    {
        name: "Jangtaesan Mountain, Daejeon",
        coords: [36.219296, 127.3394828],
        imageLink: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgZ0QPcWXw2y6fYK9zH1uDbg-c_8ljZmnyimbGhGEgC28LB2YhvvRo8zdzaCgwfhM6WXEqfF5RZXLQOluPVeuz3245wVEXRJB_5wq47-NPdyp5gszt14kC_OdGYZBcBtDOKzG2G39oFq9IrQzPgwZeFXr4-ACbCBp1y5ypSRUKKMo-BiWbyZi8rtUUPfn7q/s856/jangtaesan.png",
    },
    {
        "Name": "Location 2",
        "Coordinates": "34.052235, -118.243683",
        "Image Link": "https://example.com/image2.jpg",
    },
    {
        "Name": "Location 3",
        "Coordinates": "51.507351, -0.127758",
        "Image Link": "https://example.com/image3.jpg",
    },
    {
        "Name": "Location 4",
        "Coordinates": "48.856613, 2.352222",
        "Image Link": "https://example.com/image4.jpg",
    },
]

# Convert the data into a DataFrame
df = pd.DataFrame(data)

# Write the DataFrame to an Excel file
excel_file_path = "locations.xlsx"
df.to_excel(excel_file_path, index=False, engine="openpyxl")

# Provide the file path to download
excel_file_path
