# TIMEREPORT-UI

## Local development

Create a `.env` file with the following values:

```
REACT_APP_backend_url=http://localhost:8010
REACT_APP_google_client_id="728339485019-goirkmgqtegqhmtgfagcjn838dv0ak76.apps.googleusercontent.com"
```

__NOTE: requires locally running [timereport-api](https://github.com/codelabsab/timereport-api). Optionally you can change `backend_url` to dev-api at AWS.__


#### Start the UI locally

1. Build the docker image:

```
# docker build . -t local-timereport-ui
```

2. Start the container:

```
# docker run -p 3000:3000 local-timereport:latest
```

Now you should be to access the UI via http://localhost:3000

## Create secrets for travis-ci

```
$ tar cvf secrets.tar .env*
a .env
a .env.dev
a .env.prod

$ travis encrypt-file secrets.tar --add
storing result as secrets.tar.enc
storing secure env variables for decryption

Make sure to add secrets.tar.enc to the git repository.
Make sure not to add secrets.tar to the git repository.
Commit all changes to your .travis.yml.

$ git add secrets.tar.enc .travis.yml

```
