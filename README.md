#### TIMEREPORT-UI

#### Requirements

.env file with the following values, requires locally running `timereport-api`. Optionally you can change `backend_url` to dev-api at AWS.

```
REACT_APP_backend_url=http://localhost:8010
REACT_APP_google_client_id="728339485019-goirkmgqtegqhmtgfagcjn838dv0ak76.apps.googleusercontent.com"
```

#### Installation

Use nodejs version 12, later versions won't install/build correctly.

```
npm install
# Start development build locally
npm run start
# Start production like build locally
npm run build
npx serve -s build/ -l 3000
```

To log in you need an account at our octa org, ask for an invite in slack.

### Packaing .env secrets for travis-ci

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
