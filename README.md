# TIMEREPORT-UI

## Local development


__NOTE: requires locally running [timereport-api](https://github.com/codelabsab/timereport-api). Optionally you can change `backend_url` to dev-api at AWS.__


#### Start the UI locally

1. Build the docker image:

```
# docker build . -t local-timereport-ui
```

2. Start the container:

```
# docker run -e REACT_APP_backend_url="http://localhost:8010/v1" -p 3000:3000 local-timereport-ui:latest
```

Now you should be to access the UI via http://localhost:3000


## Update secrets

Secrets are added/deleted/updated in GitHub action [secrets](https://github.com/codelabsab/timereport-ui/settings/secrets/actions).

Secrets should end with `_dev` or `_prod`.

### Backend API key
this secret to authenticate requests to backend.

### Google client ID secret
This secret is the google client id that we use to authenticate codelabs users via google auth.

User for prod:
https://console.cloud.google.com/apis/credentials/oauthclient/54600554888-jhtcn28sshqn0p2c115rokqr8q9lhoqa.apps.googleusercontent.com?authuser=1&project=timereport-login

User for dev:
https://console.cloud.google.com/apis/credentials/oauthclient/54600554888-n0dbubgjrk1plgrmiv8p5vf9g3n3uk3h.apps.googleusercontent.com?authuser=1&project=timereport-login
