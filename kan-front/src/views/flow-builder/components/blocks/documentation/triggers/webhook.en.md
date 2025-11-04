# Webhook

## What is it

An incoming HTTP request that triggers a flow. External systems can send data to your webhook URL.

## Why use it

- Receive notifications from external services (GitHub, Stripe, Jira)
- Integration with other applications
- Receive data from website forms
- API for other systems

## Fields

### HTTP Method

What type of operation will be performed

- **Receive Data (POST)** - when an external system sends you data (recommended)
- **Request Information (GET)** - when an external system requests data from you
- **Full Update (PUT)** - when you need to completely replace data
- **Partial Update (PATCH)** - when you need to change only part of the data
- **Delete Data (DELETE)** - when you need to delete data

### Webhook URL

**⚠️ Not yet implemented** - will be automatically generated

Unique URL for this flow. Example: `https://api.app.com/webhooks/abc123`

### Webhook Secret

Secret key to verify request authenticity

**How it works:**

1. You give the secret to the sender
2. Sender signs the request with this secret (HMAC SHA256)
3. You verify the signature

**Recommended** for security

### Headers to Extract

Which headers to save to variables

Example: `Authorization`, `X-GitHub-Event`

### Save Result to Variable

Variable name to save request data

Example: `webhook_data` → available as `{webhook_data.body}`, `{webhook_data.headers}`

## Usage Examples

### GitHub - push notification

```
When someone pushes to repository:
1. GitHub sends POST to your webhook
2. Webhook receives commit data
3. Task "Check code" is created
```

### Stripe - payment completed

```
When client paid:
1. Stripe sends webhook about payment.succeeded
2. Webhook receives payment data
3. Order status updated to "Paid"
```

### Website form

```
When user submits form:
1. Website sends POST with form data
2. Webhook receives name, email, message
3. Task created for manager
```

### Jira - new issue

```
When issue created in Jira:
1. Jira sends webhook
2. Webhook receives issue data
3. Issue duplicated in your system
```

### Telegram bot

```
When user writes to bot:
1. Telegram sends webhook with message
2. Webhook receives text and user_id
3. Sent to AI for response
```
