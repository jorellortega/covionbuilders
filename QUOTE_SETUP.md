# Quote Form Setup Guide

## Overview
The quote form has been enhanced with full functionality including form validation, database storage, and user feedback.

## Features Added

### ✅ Form Validation
- Real-time validation using Zod schema
- Required field validation
- Email format validation
- Phone number validation
- Minimum character requirements
- Service selection validation
- Terms and conditions agreement

### ✅ Database Integration
- Supabase integration for storing quote requests
- Proper data structure with all form fields
- Status tracking for quote requests
- Timestamps for created and updated dates

### ✅ User Experience
- Loading states during submission
- Success/error toast notifications
- Success page after submission
- Form reset after successful submission
- Visual error indicators
- Disabled submit button during processing

### ✅ Form Fields
- Contact Information (Name, Email, Phone)
- Project Description
- Project Details (Type, Size, Location, Timeline, Budget)
- Services Selection (Multiple checkboxes)
- Additional Comments
- Terms and Conditions

## Database Setup

### 1. Create the Database Table
Run the SQL commands in `supabase-setup.sql` in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-setup.sql
```

### 2. Environment Variables
Make sure you have these environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How to Use

### For Users
1. Navigate to `/quote`
2. Fill out the contact information
3. Expand the accordion sections to add project details
4. Select required services
5. Agree to terms and conditions
6. Submit the form
7. Receive confirmation and next steps

### For Administrators
Quote requests are stored in the `quote_requests` table with the following statuses:
- `pending` - New request (default)
- `reviewed` - Request has been reviewed
- `quoted` - Quote has been prepared
- `contacted` - Customer has been contacted
- `closed` - Request is complete

## Database Schema

```sql
quote_requests (
  id UUID PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_description TEXT NOT NULL,
  project_type TEXT NOT NULL,
  project_size TEXT,
  project_location TEXT NOT NULL,
  project_timeline TEXT NOT NULL,
  budget TEXT NOT NULL,
  company TEXT,
  services TEXT[] NOT NULL,
  additional_comments TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

## Validation Rules

- **First Name**: Minimum 2 characters
- **Last Name**: Minimum 2 characters
- **Email**: Valid email format
- **Phone**: Minimum 10 characters
- **Project Description**: Minimum 10 characters
- **Project Type**: Required selection
- **Project Location**: Required
- **Timeline**: Required selection
- **Budget**: Required selection
- **Services**: At least one service must be selected
- **Terms**: Must be agreed to

## Error Handling

The form includes comprehensive error handling:
- Field-level validation errors
- Database connection errors
- Network errors
- User-friendly error messages
- Toast notifications for success/error states

## Customization

### Adding New Services
Edit the `services` array in the quote page:

```typescript
const services = [
  "Architectural Design",
  "Construction Management",
  // Add new services here
]
```

### Modifying Validation Rules
Update the `quoteFormSchema` in the quote page:

```typescript
const quoteFormSchema = z.object({
  // Modify validation rules here
})
```

### Changing Success Message
Update the success page content in the `isSubmitted` section.

## Testing

1. Fill out the form with valid data
2. Test validation by submitting with missing fields
3. Test email format validation
4. Test service selection requirement
5. Test terms agreement requirement
6. Verify database insertion
7. Check toast notifications

## Security

- Row Level Security (RLS) enabled on the table
- Public insert policy for quote submissions
- Authenticated user view policy for admin access
- Input validation and sanitization
- CSRF protection through Next.js

## Performance

- Form validation runs on client-side for immediate feedback
- Database queries are optimized with proper indexing
- Lazy loading of accordion content
- Efficient state management with React Hook Form 