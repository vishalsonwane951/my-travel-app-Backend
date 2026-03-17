import express from 'express';

const router   = express.Router();
const BASE     = 'https://maps.googleapis.com/maps/api/place';
const GKEY     = () => process.env.ANTHROPIC_API_KEY;


export const autocomplete = asyncHandler(async(req,res)=> {
     try {
    const { input, type, sessiontoken, location, radius } = req.query;
    if (!input || input.trim().length < 2) return res.json({ predictions: [] });
 
    const params = new URLSearchParams({
      input:        input.trim(),
      key:          GKEY(),
      sessiontoken: sessiontoken || '',
      language:     'en',
    });
 
    if (type === 'destination') params.set('types', '(regions)');
    if (type === 'area' && location) {
      params.set('location', location);
      params.set('radius',   radius || '50000');
    }
 
    const data = await fetch(`${BASE}/autocomplete/json?${params}`).then(r => r.json());
 
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      return res.json({ predictions: [] });
    }
 
    const predictions = (data.predictions || []).map(p => ({
      placeId:     p.place_id,
      name:        p.structured_formatting?.main_text || p.description,
      description: p.description,
      sub:         p.structured_formatting?.secondary_text || '',
    }));
 
    res.json({ predictions });
  } catch (err) {
    console.error('Places autocomplete error:', err.message);
    res.json({ predictions: [] });
  }
});
 

export const details = asyncHandler(async(req,res)=> {
     try {
    const { placeId, sessiontoken } = req.query;
    if (!placeId) return res.status(400).json({ error: 'placeId required' });
 
    const params = new URLSearchParams({
      place_id:     placeId,
      fields:       'geometry,name,formatted_address',
      key:          GKEY(),
      sessiontoken: sessiontoken || '',
    });
 
    const data = await fetch(`${BASE}/details/json?${params}`).then(r => r.json());
    if (data.status !== 'OK') return res.json({ location: null });
 
    const loc = data.result?.geometry?.location;
    res.json({
      name:     data.result?.name,
      address:  data.result?.formatted_address,
      location: loc ? `${loc.lat},${loc.lng}` : null,
    });
  } catch (err) {
    console.error('Places details error:', err.message);
    res.json({ location: null });
  }
});