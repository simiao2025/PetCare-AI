# PetCare AI - Mobile

## Setup

1. Install dependencies: `npm install`
2. Start Metro bundler: `npm start`
3. Run on Android: `npm run android`
   - _Note_: Ensure you have an Android emulator running or device connected.

## Configuration

- API URL is configured in `src/services/api.ts`.
  - Android Emulator: `http://10.0.2.2:3000`
  - iOS Simulator: `http://localhost:3000`

## Verification

- **Dashboard**: Should load appointment data from the backend.
- **Occupancy Meter**: Should reflect the appointments fetched.
- **Emergency Button**: Visual check.
