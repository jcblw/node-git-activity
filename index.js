#!/usr/bin/env node

var
moment = require( 'moment' ),
childProcess = require( 'child_process' ),
untilde = require( 'untildify' ),
spawn = childProcess.spawn,
exec = childProcess.exec,
argv = require('minimist')(process.argv.slice(2)),
dir = argv.d || argv.dir,
_start = argv.s || argv.start || moment().subtract( 1, 'days' ),
_end = argv.e || argv.end || moment(),
user = argv.u || argv.user || null,
me = argv.m || argv.me,
json = argv.json,
start, 
end;

init( );


/*
    init
    --------------------------------------------------------------------------------------
    glue that puts together other functions
*/

// wrap content to make this a javascript api as well
// TODO fix i/o
function init (  ) {

    var activity;

    dir = dir ? untilde( dir ) : null;
    start = formatDate( _start );
    end = formatDate( _end );

    if ( start === 'Invalid date' ) {
        handleError( new Error ( 'Start date provided ( ' + _start + ' ) is not a vaild date' ) );
    }

    if ( end === 'Invalid date' ) {
        handleError( new Error ( 'End date provided ( ' + _end + ' ) is not a vaild date' ) );
    }

    if ( me ) {
        getMe( {
            cwd: dir
        },
        function( email ) {
            activity = getActivity( {
                after: start,
                before: end,
                author: email,
                json : json,
                options: {
                    cwd: dir
                }
            } );

            activity.stdout.pipe( process.stdout );
            activity.stderr.on( 'data', handleError );
            activity.on( 'error', handleError );
        } );
        return;
    }

    activity = getActivity( {
        after: start,
        before: end,
        author: user,
        json: json,
        options: {
            cwd: dir
        },
    } );

    activity.stdout.pipe( process.stdout );
    activity.stderr.on( 'data', handleError );
    activity.on( 'error', handleError );

}

// end wrap

/*
    getActivity
    --------------------------------------------------------------------------------------
    spawns a process to use git log to grab activity
    params
        options ( Object ) - an object of configuration for spawn
            options.after ( String ) - start time 
            options.before ( String ) - end time
            options.author ( String ) - optional some string of substring of author name
            options.json ( Boolean ) - optional defaults to false will make activiy format into json
    returns
        spawned process ( Object )
*/
function getActivity ( options ) {
    var 
    after = '--after=' + options.after,
    before = '--before=' + options.before,
    author = options.author ? ( '--author=' + options.author ) : null,
    format = options.json ? ( '--pretty=format:{ "commit": "%H",  "author": "%an <%ae>",  "date": "%ad",  "message": "%f"}' ) : null,
    args = [ 'log', after, before ],
    git;

    if ( author ) args.push( author );
    if ( format ) args.push( format );

    git = spawn( 'git', args, options.options );

    return git; // return stream
}

/*
    formatDate
    --------------------------------------------------------------------------------------
    formats the date to a date format consumable by git log
    params
        date ( Mixed ) - will run date through moment and format it.
    returns
        formatted date ( String );
*/

function formatDate( date ) {
    // 2013-11-12 00:00
    return moment( new Date( date ) ).format( 'YYYY-MM-DD HH:mm' );
}

/*
    handleError
    --------------------------------------------------------------------------------------
    simple util for handling errors
    params
        error ( Mixed ) - should be an <Error> but strings are accepted too 
*/

function handleError( error ) {
    process.stderr.write( error.message || error || 'weird error' );
    process.exit();
}

/*
    getMe
    --------------------------------------------------------------------------------------
    a way to get the current git user in a certain directory
    params
        options ( Object ) - options to pass to exec
        done ( Function ) - a callback to pass user email to 
*/

function getMe ( options, done ) {
    var 
    email = '';

    exec( 'git config user.email', options, function( err, stdout, stderr ) {
        if ( err ) {
            handleError( err );
            return;
        }
        if ( stderr ) {
            handleError( stderr );
        }
        done( stdout.trim() );
    } );
}

