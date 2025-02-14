# Marpaz

Marpaz is a mobile application that makes it easy to create shopping lists for market and grocery store shopping. Users can create, edit, and manage their shopping lists.

## 🚀 Technologies

### Backend
- **Spring Boot** (REST API)
- **Spring Data JPA** (Database management)

### Frontend
- **React Native (Expo)**
- **React Navigation** (Page transitions)
- **Axios** (API calls)

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/BatuhanKANBER/Marpaz.git
    ```

### Backend
1. Deploy the backend project on a free AWS server.
   - AWS deployment guide:
     ```bash
    https://www.youtube.com/watch?v=ua0cb2LjCW4
     ```
2. Secure your AWS server (After the build process, your device will not connect to insecure IPs):
   - AWS security guide:
     ```bash
     https://www.youtube.com/watch?v=JQP96EjRM98&t=678s
     ```

### Frontend
1. Enter the domain you secured in the `.env` file.
2. Create an Expo account.
3. Log in to the Expo account:
    ```bash
    eas login
    ```
4. Build the frontend project:
    ```bash
    eas build --platform android --profile preview
    ```
5. After the build, Expo will provide you with a QR code and a link. You can use the Expo app to scan the QR code or open the link to download the app on your phone and start using it.
