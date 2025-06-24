# Deployment & WordPress Integration

1. Build or serve the frontend from the `frontend/public` folder.
2. Host the `public` folder on your web server (e.g. `/runya-app`).
3. Embed the app in WordPress using an iframe:

```
<iframe src="/runya-app/index.html" width="375" height="667" style="border:none;" allowfullscreen></iframe>
```

Alternatively create a shortcode in WordPress to load the iframe.

The backend can be deployed on Heroku/Vercel. Make sure `MONGO_URL` and `JWT_SECRET` environment variables are configured.
