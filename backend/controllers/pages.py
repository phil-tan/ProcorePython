from flask import Blueprint, render_template, jsonify, send_from_directory, redirect
from .oauth import login_required, refresh_app

pages = Blueprint('pages', __name__)

@pages.route("/")
@login_required
def home():
    print('home path')
    refresh_app()
    print('refreshing app')
    return redirect('/app/projects')

@pages.route('/api/data')
def get_data():
    data = {'message': 'This is the Procore App'}
    return jsonify(data)

@pages.route('/uploads/<path:filename>')
def download_file(filename):
    return send_from_directory('./images/', filename, as_attachment=True)



