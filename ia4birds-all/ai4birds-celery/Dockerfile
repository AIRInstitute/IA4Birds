FROM python:3.10-slim

RUN mkdir /app

WORKDIR /app

# Add source files

ADD . /app

# Install dependencies

RUN python -m pip install -r requirements.txt

# Start application

CMD ["bash", "launch.sh"]
