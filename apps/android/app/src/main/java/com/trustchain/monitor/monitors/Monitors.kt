package com.trustchain.monitor.monitors

import android.util.Log

object UrlExtractor {
    fun extract(text: String): List<String> {
        val urlPattern = android.util.Patterns.WEB_URL
        val matcher = urlPattern.matcher(text)
        val urls = mutableListOf<String>()
        while (matcher.find()) {
            urls.add(matcher.group())
        }
        return urls
    }
}

class SmsMonitor {
    companion object {
        private const val TAG = "SmsMonitor"
        
        fun analyzeAndDispatch(sender: String, messageBody: String) {
            Log.d(TAG, "Intercepted SMS from $sender")
            val urls = UrlExtractor.extract(messageBody)
            
            // Send to Trust Chain backend
            com.trustchain.monitor.network.WebhookDispatcher.dispatch(
                source = "sms",
                content = messageBody,
                urls = urls
            )
        }
    }
}

class WhatsappMonitor {
    companion object {
        private const val TAG = "WhatsappMonitor"
        
        fun analyzeAndDispatch(sender: String, messageBody: String) {
            Log.d(TAG, "Intercepted WhatsApp Message from $sender")
            val urls = UrlExtractor.extract(messageBody)
            
            // Send to Trust Chain backend
            com.trustchain.monitor.network.WebhookDispatcher.dispatch(
                source = "whatsapp",
                content = messageBody,
                urls = urls
            )
        }
    }
}
