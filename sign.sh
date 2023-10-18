#!/bin/sh
wk=$(pwd)

# Sign the app
output_dir="out/make/zip/darwin/arm64/signed"
mkdir -p "$output_dir/unzip"


while getopts "o:" opt; do
  case $opt in
    o)
      output_dir="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

shift $((OPTIND-1))

# Get name of file to sign
if [ -z "$1" ]
  then
    echo "No argument supplied"
    exit 1
fi

filename=$(basename "$1")

# make out/make/zip/darwin/arm64 folder if not exists
# 1. Unzip the file
unzip -o "$1" -d "$output_dir/unzip"

cd "$output_dir"
# 2. Sign the file

codesign --force --deep -s 'liz inerati' "unzip/apple-photos-db-explorer.app"


# 3. Zip the file
#  zip -r "unzip/$filename" "$output_dir/unzip/apple-photos-db-explorer.app"
#(cd "unzip/" && zip -9 -r - .) > "$filename"
cd $wk
