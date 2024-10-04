# EventMeetup

EventMeetup is a mobile application designed to help users find and participate in events happening in their local area. Users can create, manage, and join events while connecting with others who share similar interests.

## Features

- **User Authentication**: Sign up and log in to manage your events.
- **Event Creation**: Create events with details such as location, time, and description.
- **Event Discovery**: Explore nearby events based on your location.
- **Chatbot Integration**: Get personalized event recommendations and assistance through the integrated chatbot.
- **User Profiles**: View and edit user profiles to manage personal information and preferences.
- **RSVP and Attendance**: RSVP to events and manage attendance easily.

## Technologies Used

- **Frontend**: React Native, Expo
- **Backend**: Supabase
- **Database**: PostgreSQL (via Supabase)
- **Chatbot**: Hugging Face Transformers for personalized responses
- **State Management**: React Context API
- **Location Services**: Expo Location

## Installation

To get started with the EventMeetup project, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/John-Prabu-A/EventMeetUp.git
   ```

2. Navigate to the project directory:

   ```bash
   cd EventMeetup
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the root directory and add your Supabase URL and API key:

     ```plaintext
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     EXPO_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key
     ```

5. Run the application:

   ```bash
   npm start
   ```

## Usage

1. Launch the app on your mobile device or emulator.
2. Sign up or log in to your account.
3. Create or discover events in your area.
4. Use the chatbot feature to get personalized event recommendations.

## Contributing

We welcome contributions to the EventMeetup project! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch:

   ```bash
   git checkout -b feature/YourFeature
   ```

3. Make your changes and commit them:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push to your branch:

   ```bash
   git push origin feature/YourFeature
   ```

## Acknowledgements

- [Supabase](https://supabase.com/) for providing the backend infrastructure.
- [Expo](https://expo.dev/) for simplifying mobile development.
