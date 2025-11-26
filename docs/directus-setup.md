# Directus data model

The React app reads and writes directly to Directus (running at `http://localhost:8055`).  
To make the new profile, booking, and reviews features work you need the following collections
and relations set up in Directus.

## Collections & fields

### `Category`, `SubCategory`, `Items` (existing)
These already power the discovery experience. No structural changes were made, but make sure
that `Items.image` is a **file** field so previews render correctly.

### `Drivers`
Used for both the Drivers directory and Custom Tour booking.

| Field | Type | Notes |
| --- | --- | --- |
| `name` | string | Driver full name |
| `phone` | string | Click-to-call value |
| `location` | string | Home base |
| `vehicle` | string | e.g. “Mercedes Vito (6 pax)” |
| `years_experience` | integer | Years on the road |
| `languages` | json / m2m | Store as JSON array `["English","Arabic"]` or a related collection |
| `specialties` | json / m2m | Same approach as `languages` |
| `availability` | string | Short status badge |
| `day_rate` | decimal | Optional |
| `bio` | text | Displayed in profile drawer |
| `image` | file | Hero/avatar image |
| `rating_cache` | decimal | (optional) maintained automatically by Directus flow or leave null |

### `Bookings`
Central store for every reservation (activity or custom tour).

| Field | Type | Notes |
| --- | --- | --- |
| `status` | string | Enum: `pending`, `confirmed`, `completed`, `cancelled` |
| `type` | string | Enum: `activity`, `custom` |
| `start_date` | datetime | What user picks in UI |
| `participants` | integer | Party size |
| `total_price` | decimal | Derived client-side for now |
| `notes` | text | Free-form notes / custom requests |
| `destinations` | json | Array of stops for custom tours |
| `user` | m2o → `directus_users` | Set default to `$CURRENT_USER` to avoid manual population |
| `item` | m2o → `Items` | Required for activity bookings, optional for custom |
| `driver` | m2o → `Drivers` | Optional |
| `created_at` `updated_at` | datetime | Enable standard Directus timestamps |

### `Review`
Existing collection that stores place/Item feedback. Make sure it has:

| Field | Type | Notes |
| --- | --- | --- |
| `itemId` | m2o → `Items` | Place that was reviewed |
| `user` | m2o → `directus_users` | Reviewer |
| `booking` | m2o → `Bookings` | Optional but lets us trace provenance |
| `rating` | integer | 1–5 |
| `comment` | text | Review body |

### `DriverReviews`
New collection dedicated to feedback on drivers.

| Field | Type | Notes |
| --- | --- | --- |
| `driver` | m2o → `Drivers` | Required |
| `user` | m2o → `directus_users` | Required |
| `booking` | m2o → `Bookings` | Optional, used to verify completed trips |
| `rating` | integer | 1–5 |
| `comment` | text | Review body |

## Adding drivers through Directus

1. In the Directus app go to **Content > Drivers**.
2. Click **Create item**, fill in the fields above, and upload an image.
3. Save. The React app will pull newly added drivers automatically (list is cached via React Query but re-syncs on focus/refetch).

## Booking workflow

1. When a traveller books an activity or custom tour in the UI we create a `Bookings` record with `status = "pending"`.
2. Staff can review the booking inside Directus and update `status` to `confirmed` or `completed`.
3. Once status becomes `completed`, travellers can submit a place review and/or driver review.  
   The UI enforces this by checking the booking + review combination.

## Review aggregation

No flows are required, but you can optionally create a Directus Flow that recalculates `Drivers.rating_cache`
or `Items.rating` whenever a review is created. The front-end already recalculates ratings on the fly if the cache is absent.

