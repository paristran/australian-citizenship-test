# Citizenship Journey Feature

## Overview

The Citizenship Journey page allows users to create and share a visual timeline of their path to Australian citizenship.

## Database Setup

Run the SQL schema in Supabase:

```bash
# In Supabase SQL Editor, run:
database/journey_schema.sql
```

## Features

### Milestone Types
- ✈️ First Arrival in Australia
- 🛂 Permanent Residency (PR)
- 📄 Citizenship Application
- 🏛️ Citizenship Approval
- 🎉 Citizenship Ceremony
- 📍 Custom Milestones (user-defined)

### Image Generation
- Users can generate a PNG image of their journey
- Download to local device
- Copy to clipboard
- Share on social media (Facebook, Twitter, LinkedIn)

### Auto-calculations
- Years in Australia (from first to last milestone)
- Timeline range (start year to end year)
- Total milestone count

## API Endpoints

### GET /api/journey
Returns the user's citizenship journey with all milestones

### POST /api/journey
Create or update journey with milestones

Request body:
```json
{
  "title": "My Citizenship Journey",
  "subtitle": "After 6+ years, I am now a proud Australian citizen!",
  "years_in_australia": 6,
  "start_year": 2018,
  "end_year": 2024,
  "milestones": [
    {
      "milestone_type": "arrival",
      "title": "First Arrival in Australia",
      "milestone_date": "2018-01-05",
      "icon": "✈️"
    }
  ]
}
```

### DELETE /api/journey
Delete the user's journey and all milestones

## Frontend

- Location: `/app/journey/page.tsx`
- Access: `/journey` (requires authentication)
- Uses `html-to-image` library for PNG generation
- Responsive design with Tailwind CSS

## Testing

### Manual Testing
1. Login to the app
2. Navigate to "My Journey" from dropdown or nav
3. Add milestones with dates
4. Click "Save Journey"
5. Preview appears below
6. Test download and copy functions
7. Test social sharing buttons

### E2E Testing
```bash
npm run test:e2e -- --grep "Journey"
```

## Future Enhancements

- [ ] Custom background themes
- [ ] More milestone icons
- [ ] Export to PDF
- [ ] Share directly to Instagram Stories
- [ ] Animated journey video
- [ ] Public journey links
- [ ] Community journey gallery

## Technical Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Backend:** Next.js API Routes
- **Database:** Supabase PostgreSQL with RLS
- **Image Generation:** html-to-image
- **Date Handling:** date-fns

## Troubleshooting

### Image not generating
- Check browser console for errors
- Ensure all milestones have valid dates
- Try refreshing the page

### Milestones not saving
- Check user is authenticated
- Check network tab for API errors
- Verify database schema is created

### Social sharing not working
- Popup blockers may prevent sharing
- Try whitelisting the site
