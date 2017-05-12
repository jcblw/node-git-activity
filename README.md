# Git Activity

[![Greenkeeper badge](https://badges.greenkeeper.io/jcblw/node-git-activity.svg)](https://greenkeeper.io/)

Simple utiltity for getting a list of commits for a specified time.

### Why not just git?

    $ git log

Sure that is what is used in this module. We just run that command and spit the information out, but we also include a date time module [moment](http://momentjs.com/) to allow for easier time date handling. Also there is the added ability to just inlude the flag `--me` to grab only your own commmits. One last thing is that you can steam out json which can be done with bash but we abstract the conventions away.

### Install

    $ npm install git-activity -g

### Usage

    $ git-activity [ --flags ]
    
examples

    $ git --start=2/11/2014 --end=3/11/2014
    $ git --json --me --dir=/home/notarobot/beepboop
    $ git --user=terminator | dat import --json --primary=commit

available flags

    -d, --dir       The directory to run git from, defaults to cwd
    -s, --start     The start time 
    -e, --end       The end time
    -u, --user      The user to query by
    --json          Format the output to json
    --me            Grab current users commits 

### Wishlist

- [ ] javascript api
- [ ] more access to format
- [ ] better error handling
