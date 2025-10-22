from flask import Flask, render_template, request, redirect, url_for, session, flash
import firebase_admin
from firebase_admin import credentials, auth
import pandas as pd
import requests
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this in production

# Initialize Firebase
cred = credentials.Certificate('serviceAccountKey.json')
firebase_admin.initialize_app(cred)

# Load farmers data
farmers_df = pd.read_csv('farmer.csv')

# Weather API key (replace with actual key)
WEATHER_API_KEY = 'your_weather_api_key'

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login_post():
    email = request.form['email']
    password = request.form['password']
    try:
        user = auth.get_user_by_email(email)
        # For demo, check if email in farmers_df
        if email in farmers_df['email'].values:
            session['user'] = email
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials')
            return redirect(url_for('login'))
    except:
        flash('Invalid credentials')
        return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect(url_for('login'))
    farmer = farmers_df[farmers_df['email'] == session['user']].iloc[0]
    return render_template('dashboard.html', farmer=farmer)

@app.route('/profile')
def profile():
    if 'user' not in session:
        return redirect(url_for('login'))
    farmer = farmers_df[farmers_df['email'] == session['user']].iloc[0]
    return render_template('profile.html', farmer=farmer)

@app.route('/crops')
def crops():
    if 'user' not in session:
        return redirect(url_for('login'))
    return render_template('crops.html')

@app.route('/weather')
def weather():
    if 'user' not in session:
        return redirect(url_for('login'))
    # Mock weather data
    weather_data = {
        'temperature': 25,
        'humidity': 60,
        'condition': 'Sunny'
    }
    return render_template('weather.html', weather=weather_data)

@app.route('/market')
def market():
    if 'user' not in session:
        return redirect(url_for('login'))
    # Mock market prices
    prices = {
        'wheat': 200,
        'corn': 150,
        'tomatoes': 300
    }
    return render_template('market.html', prices=prices)

@app.route('/notifications')
def notifications():
    if 'user' not in session:
        return redirect(url_for('login'))
    # Mock notifications
    notifs = ['New crop update', 'Weather alert']
    return render_template('notifications.html', notifications=notifs)

@app.route('/admin')
def admin():
    if 'user' not in session:
        return redirect(url_for('login'))
    # Simple admin panel
    all_farmers = farmers_df.to_dict('records')
    return render_template('admin.html', farmers=all_farmers)

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
