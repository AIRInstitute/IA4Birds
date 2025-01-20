FROM python:3.8

RUN mkdir /app

WORKDIR /app

# Add source files

ADD . /app

#Updated pip
RUN pip install pip --upgrade

# Install dependencies

RUN python -m pip install --default-timeout=100 -r requirements.txt

RUN pip install python-dotenv
# Install package

RUN python -m pip install . --upgrade

# Prepare API port

EXPOSE 5000

# Start application

CMD ["ai4birds_ingest_service"]