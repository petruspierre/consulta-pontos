#!/bin/bash

# Check if the .env file exists
if [ -f .env ]; then
    # Read each line in the .env file
    while IFS='=' read -r key value; do
        # Check if the line is not empty
        if [[ ! -z "$key" && ! -z "$value" ]]; then
            # Append the environment variable to the Docker run command
            run_command+=" -e $key=\"$value\""
        fi
    done < .env

    # Construct the final Docker run command
    docker_run_command="docker run$run_command your-image-name"
    
    echo "Generated Docker run command:"
    echo "$docker_run_command"
else
    echo ".env file not found."
fi