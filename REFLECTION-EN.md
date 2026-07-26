# Kantian Travel — Product Reflection

> 2026-07-26. A retrospective after a full product iteration cycle.

## Conclusion

**Travel planning as a standalone product probably doesn't stand on its own.**

## Why

### Breaking Down the Core Actions of Travel Planning

1. **Discovery / Inspiration** — "I want to go there" → Already solved by Xiaohongshu (photos + videos + real experiences)
2. **Decision-making** — Weather, transport, accommodation → Experienced travelers do this in 15 minutes
3. **Execution / Navigation** — How to get around once there → Already solved by Amap / Google Maps
4. **Booking** — Flights, hotels, tickets → Already solved by Ctrip / booking.com

"Planning" sits between steps 1-4, and each step is already well-served by existing tools. The planning layer itself is too thin to support a product.

### What Actually Drives Inspiration

People get inspired on Xiaohongshu through **visual impact — photos and videos**, not text.

There are only three paths for imagery, each with a fatal flaw:
- **Real user photos (Xiaohongshu)** — Both authentic AND beautiful (people choose angles, add filters), but it's other people's content
- **Google Places** — Authentic but ugly (random tourist snapshots), doesn't make you want to go
- **AI-generated** — Beautiful but fake, you arrive and it looks nothing like that, trust collapses

Xiaohongshu found the intersection of "authentic" and "attractive." We can't replicate this.

### Why AI-Generated Travel Content Doesn't Work

- No one gets inspired to visit a place because of AI-generated text
- Inspiration is fundamentally about trust transfer: I trust this person's taste → so I want to go where they recommend
- AI has no taste, no real experience, can't write content that makes people feel something
- Market validation: not a single AI travel planning product has become beloved

### Planning Itself Is Not a Pain Point

For anyone who's done it a few times, trip planning is three steps:
1. Check weather (can I go?)
2. Check transport (how do I get there?)
3. Book accommodation

Everything else (where to eat, what to explore, which route to walk) you figure out on the ground. Pre-planned itineraries change the moment you arrive anyway.

## What Travel Planning Products Are Doing

| Type | Examples | What They Do | Problem |
|------|----------|--------------|---------|
| AI itinerary generation | Roam Around, Layla, TripGenie | Input "Guizhou 6 days" → output full itinerary | Content has no inspirational power; users still verify on Xiaohongshu |
| Itinerary editors | Wanderlog, Qiongyou Planner | Drag POIs onto calendar, auto-calculate routes | More complex than just listing in a notes app; tool is heavier than the problem |
| Booking aggregators | TripIt, Google Travel | Auto-organize confirmation emails into timeline | Has value but low ceiling; solves "viewing" not "planning" |
| Platform add-on features | Ctrip "smart itinerary", Fliggy | Add "plan your trip" in booking flow | Fundamentally a sales funnel — recommends products with commission |

**Common problems across all:**
- All try to productize "planning" as an action, but users don't feel planning needs a tool
- All try to replace "browsing Xiaohongshu" but can't match its inspirational content
- All get used once before departure and never opened again
- All treat "the itinerary" as core deliverable, but itineraries break on contact with reality

## Our Iteration Journey

### Phase 1: AI-Generated Plans (v0.1.0-alpha)
- Used LLMs to generate complete travel plans
- Iterated through 5 generations of prompts, 3 models
- POI coordinate coverage: 15% → 100%
- Integrated Google Places photos
- **Problem**: Generated content had zero inspirational power, worse than Xiaohongshu

### Phase 2: User-Provided Content + AI Organization (today's pivot)
- User throws in screenshots, AI extracts + organizes + checks weather
- Shipped a Guizhou trip MVP end-to-end
- **Problem**: The organized output is something users could do themselves in 15 minutes

### Phase 3: Reflection (now)
- Travel planning has a low ceiling as a product category
- "Planning" itself is not a pain point
- Need to rethink the direction entirely

## Valuable Takeaways

The product direction may not hold, but this period wasn't wasted:

1. **"Channel as product"** — Any scenario can be a well-tuned channel, no standalone app needed
2. **Screenshot → structured extraction → executable output** — This capability chain applies beyond travel
3. **Real-time data overlay (weather/transit APIs)** — Where AI genuinely outperforms humans
4. **Understanding AI content generation boundaries** — Knowing what humans should do vs. what AI should do
5. **Complete UI component library** — Gantt charts, timelines, maps, navigation buttons — reusable in the next project
6. **Product judgment heuristic** — Before building, always ask: How do people do this without AI? How long? How painful? If the answer is "15 minutes, not very painful" — don't build it.

## One Line

**Good travel platforms are built on high-quality content, not tool capabilities. AI shouldn't produce content — it should do what humans can't or won't do themselves.**
