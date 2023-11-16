# TFRRS Meet Simulator
An app that uses updated data scraped from [tfrrs.org](https://www.tfrrs.org/) to create interactive championship meet simulations.

### Project Members
- Geoffrey Kleinberg
- Nathan Hajel
- Trevor Gray

### Run on Localhost

Run `scripts/up` to start the dockerized container and run the server. Run `scripts/down` to bring the server down. After any change to the code, run `scripts/rebuild` to rebuild the docker containers before running `scripts/up` again.

Alternatively, use `scripts/dev/redeploy` which will bring the server down (if up), rebuild, and put the server up.

### Run on EC2

Run `sudo yum install git`. Then clone the repository with `git clone https://github.com/cs298-398f23/geoff-nate-trevor-final.git` and navigate to the directory with `cd geoff-nate-trevor-final`. Then, run `sudo scripts/prod/deploy`. To redeploy after changes to the main branch of the git repository, run `sudo scripts/prod/redeploy`.
