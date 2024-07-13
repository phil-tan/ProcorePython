# --------------------------- IMPORTS --------------------------- #
from datetime import datetime
import os
import urllib
from flask import Flask, Blueprint, abort, request, session, redirect, render_template, url_for
import requests
import requests.auth
from dotenv import load_dotenv
from functools import wraps
from urllib.parse import urlparse, parse_qs
# ------------------------- END IMPORTS ------------------------- #

oauth = Blueprint('oauth', __name__)

# adding session may have fixed the problem with session variable runtime error.
session = {}
session['bool'] = False
# loads the environment variables
load_dotenv()
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
OAUTH_URL = os.getenv("OAUTH_URL")
BASE_URL = os.getenv("BASE_URL")
# COMPANY_ID = os.getenv("COMPANY_ID")
COMPANY_ID=562949953436954
print(f'company_id={COMPANY_ID}')
ITEM_DATE_CUSTOM_FIELD_ID = os.getenv("ITEM_DATE_CUSTOM_FIELD_ID")
# end loading env variables

# for loading next page after login page
next_page = {}
next_page['url'] = '/'

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('bool'):
            print(f"decorator requested: {request.url}")
            next_page['url'] = request.url
            return redirect("/login")
        return f(*args, **kwargs)
    return decorated_function

def redirect_url(default='pages.home'):
    return next_page.get('url') or \
           request.referrer or \
           url_for(default)

def gen_secret_key():
    """
    DESCRIPTION:
        Generates SECRET_KEY, used for existence session variables
    INPUT:
        N/A
    OUTPUT:
        return = randomly generated SECRET_KEY
    """
    return os.urandom(16)


def gen_token_disp(token):
    """
    DESCRIPTION:
        Grabs the first and last 7 characters of the token and appends them to '...'
        ex: D5tWEds...565EER_
    INPUT:
        token = access_token/refresh_token
    OUTPUT:
        return = concatinated string of auth
        """
    return token[:7] + '...' + token[-7:]


def update_date(created_at):
    '''
    DESCRIPTION:
        Turns unix time stamp into human readable time for the expire_date.Takes in unix created_at
            time value and adds 7200 (2 hours) to the created_at value before converting time.
    INPUTS:
        created_at = the unix date and time of the authorization token creation.
    OUTPUT:
        return     = returns the created_at unix date/time in a human-readable format
        '''
    return datetime.utcfromtimestamp(created_at).strftime('%Y-%m-%d %H:%M:%S')


def update_expire(created_at):
    '''
    DESCRIPTION:
        Turns unix time stamp into human readable time for the expire_date.Takes in unix created_at
            time value and adds 7200 (2 hours) to the created_at value before converting time.
    INPUTS:
        created_at = the unix date and time of the authorization token creation.
    OUTPUT:
        return     = returns the expires_at unix date/time in a human-readable format.
        '''
    return datetime.utcfromtimestamp(created_at+7200).strftime('%Y-%m-%d %H:%M:%S')


def get_me(access_token):
    '''
    DESCRIPTION:
        Calls /rest/v1.0/me endpoint and returns user login/id.
    INPUTS:
        access_token =  access_token used as credentials to communicate with the API
    OUTPUTS:
        me_json['login'] = user's login name
        me_json['id']    = user's login ID
        '''
    headers = {"Authorization": "Bearer " + access_token}
    response = requests.get(BASE_URL+"/rest/v1.0/me", headers=headers)
    me_json = response.json()
    return me_json['login'], me_json['id']


def make_authorization_url():
    '''
    DESCRIPTION:
        Creates the authorization URL to obtain the authorization code from Procore.
    INPUTS:
        N/A
    OUTPUTS:
        url: the url used to obtain the authorization code from the application.
        '''
    # Generate a random string for the state parameter
    # Save it for use later to prevent xsrf attacks
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI
    }
    url = OAUTH_URL + "/oauth/authorize?" + urllib.parse.urlencode(params)
    return url


def get_token(code):
    '''
DESCRIPTION:
    Gets the access token by utilizating the authorization code that was
    previously obtained from the authorization_url call.
INPUTS:
    code = authorization code
OUTPUTS:
    response_json["access_token"]  = user's current access token
    response_json["refresh_token"] = user's current refresh token
    response_json['created_at']    = the date and time the user's access
    token was generated
'''
    client_auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
    post_data = {"grant_type": "authorization_code",
                 "code": code,
                 "redirect_uri": REDIRECT_URI
                 }
    response = requests.post(BASE_URL+"/oauth/token",
                             auth=client_auth,
                             data=post_data)
    response_json = response.json()
    return response_json["access_token"], response_json["refresh_token"], response_json['created_at']


@oauth.route('/login', methods=["GET", "POST"])
def app_login():
    return render_template('login.html')

@oauth.route('/get_auth', methods=['POST'])
def app_auth():
    return redirect(make_authorization_url())


@oauth.route('/auth/procore/callback', methods=['POST', 'GET'])
def app_callback():
    if request.method == "GET":
        if session.get('bool') is False:
            code = request.args.get('code')
            access_token, refresh_token, created_at = get_token(code)
            session['access_token'] = access_token
            session['refresh_token'] = refresh_token
            session['created_at'] = update_date(created_at)
            session['expires_at'] = update_expire(created_at)
            session['bool'] = True
    return redirect(redirect_url())

    
@oauth.route('/session_info', methods=['POST', 'GET'])
@login_required
def app_session_info():
    print(session)
    html = render_template('session.html')
    return html.format(
        gen_token_disp(session.get('access_token')),
        session.get('created_at'),
        session['expires_at'],
        gen_token_disp(session['refresh_token'])
    )    

@oauth.route('/users/me', methods=["GET"])
@login_required
def app_page_me():
    [login, my_id] = get_me(session.get('access_token'))
    html = render_template('me.html')
    return html % (my_id, login)


@oauth.route('/refreshtoken', methods=["GET", "POST"])
def app_refresh_token():
    access_token = session.get('access_token')
    refresh_token = session.get('refresh_token')
    headers = {"Authorization": "Bearer " + access_token}
    data = {
        "client_id": CLIENT_ID,
        "grant_type": "refresh_token",
        "redirect_uri": REDIRECT_URI,
        "client_secret": CLIENT_SECRET,
        "refresh_token": refresh_token
        }
    response = requests.post(BASE_URL+'/oauth/token', data=data, headers=headers)
    response_json = response.json()
    session['access_token'] = response_json['access_token']
    session['refresh_token'] = response_json['refresh_token']
    session['created_at'] = update_date(response_json['created_at'])
    session['expires_at'] = update_expire(response_json['created_at'])
    return redirect(redirect_url())


@oauth.route('/users/revoketoken')
@login_required
def app_revoke_token():
    # access_token = session.get('access_token')
    # data = {
    #     "client_id": CLIENT_ID,
    #     "client_secret": CLIENT_SECRET,
    #     "token": access_token
    #     }
    # requests.post(BASE_URL+'/oauth/token', data=data)
    print(session)
    print("Clearing session")
    session.clear()
    session['bool'] = False
    print("Session after clearing:", session)
    return redirect('/')


def refresh_app():
    access_token = session.get('access_token')
    refresh_token = session.get('refresh_token')
    headers = {"Authorization": "Bearer " + access_token}
    data = {
        "client_id": CLIENT_ID,
        "grant_type": "refresh_token",
        "redirect_uri": REDIRECT_URI,
        "client_secret": CLIENT_SECRET,
        "refresh_token": refresh_token
        }
    response = requests.post(BASE_URL+'/oauth/token', data=data, headers=headers)
    response_json = response.json()
    session['access_token'] = response_json['access_token']
    session['refresh_token'] = response_json['refresh_token']
    session['created_at'] = update_date(response_json['created_at'])
    session['expires_at'] = update_expire(response_json['created_at'])