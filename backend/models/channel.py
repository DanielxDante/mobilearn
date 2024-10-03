from database import db
from datetime import datetime
import random
from flask import jsonify

class Channel(db.Model):
    __tablename__ = 'channel'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(80), unique=True, nullable=False)
    invite_code = db.Column(db.String(6), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now, nullable=False)
    num_user = db.Column(db.Integer, nullable=False, default=0) #Indicates number of people in channel

    @staticmethod
    def add_channel(title):
        new_channel = Channel(
            title = title,
            invite_code = Channel.generate_invite_code()
        )
        try:
            db.session.add(new_channel)
            db.session.commit()
            return jsonify({"message": "Channel added successfully"}), 200
        except Exception as e:
            db.session.rollback()
            print(f"Error occured: {e}")
            return jsonify({"error": str(e)}), 400

    @staticmethod    
    def generate_invite_code():
        while True:
            invite_code = str(random.randint(0, 999999)).zfill(6)
            if not Channel.query.filter_by(invite_code=invite_code).first():
                return invite_code

    @staticmethod   
    def get_channels():
        return Channel.query.all()

    @staticmethod
    def get_channel_by_id(id):
        return Channel.query.get(id)
    
    @staticmethod
    def get_channel_by_title(title):
        return Channel.query.filter_by(title=title).first()
    
    def __repr__(self):
        return f'<ID: {self.id}>, Channel: {self.title}, Invite_code: {self.invite_code}'