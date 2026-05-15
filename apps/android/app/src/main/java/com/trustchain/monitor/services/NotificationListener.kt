package com.trustchain.monitor.services

import android.app.Notification
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.trustchain.monitor.network.WebhookDispatcher

class TrustChainNotificationListener : NotificationListenerService() {

    private val TAG = "TrustChainMonitor"

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        
        sbn?.let {
            val packageName = it.packageName
            val extras = it.notification.extras
            val title = extras.getString(Notification.EXTRA_TITLE) ?: ""
            val text = extras.getCharSequence(Notification.EXTRA_TEXT)?.toString() ?: ""

            // We only care about messaging apps for Phase 2
            val isMessagingApp = packageName.contains("whatsapp") || 
                                 packageName.contains("mms") || 
                                 packageName.contains("telegram") ||
                                 packageName.contains("messaging")

            if (isMessagingApp && text.isNotEmpty()) {
                Log.d(TAG, "Intercepted message from $packageName")
                
                // 1. Preprocessing: Extract URLs locally (Optional speedup)
                val urls = extractUrls(text)
                
                // 2. Dispatch to Trust Chain Backend Webhook
                WebhookDispatcher.dispatch(
                    source = packageName,
                    content = text,
                    urls = urls
                )
            }
        }
    }

    override fun onNotificationRemoved(sbn: StatusBarNotification?) {
        super.onNotificationRemoved(sbn)
        // Handle removal if necessary
    }

    private fun extractUrls(text: String): List<String> {
        val urlPattern = android.util.Patterns.WEB_URL
        val matcher = urlPattern.matcher(text)
        val urls = mutableListOf<String>()
        while (matcher.find()) {
            urls.add(matcher.group())
        }
        return urls
    }
}
