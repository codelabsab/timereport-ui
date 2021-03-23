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

## Update secrets

Secrets are added/deleted/updated in github action [secrets](https://github.com/codelabsab/timereport-ui/settings/secrets/actions).

For prod secrets ends with `_prod` in the name.

### Backend URL secret
this secret is the URL to timereport-api. To find the URL it's easiest to login to AWS and find the api gateway.

### Google client ID secret
This secret is the google client id that we use to authenticate codelabs users via google auth.

This is the current in use id for prod:
https://console.cloud.google.com/apis/credentials/oauthclient/54600554888-jhtcn28sshqn0p2c115rokqr8q9lhoqa.apps.googleusercontent.com?authuser=1&project=timereport-login

