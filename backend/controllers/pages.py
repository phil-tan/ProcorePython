from flask import Blueprint, render_template, jsonify, send_from_directory, redirect
from flask_login import login_required, current_user

pages = Blueprint('pages', __name__)

@pages.route("/")
def home():
    print('home path')
    return redirect('/react/app')


@pages.route('/uploads/<path:filename>')
def download_file(filename):
    return send_from_directory('./images/', filename, as_attachment=True)



