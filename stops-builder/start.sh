# Download all stops data 
curl -o data.zip https://www.transitchicago.com/downloads/sch_data/google_transit.zip
unzip data.zip -d data
cd data
find . \! -name 'stops.txt' -delete
mv stops.txt stops.csv
cd ..
rm -rf data.zip

# Download train stops data
curl -o data/train-stops.json https://data.cityofchicago.org/resource/8pix-ypme.json
