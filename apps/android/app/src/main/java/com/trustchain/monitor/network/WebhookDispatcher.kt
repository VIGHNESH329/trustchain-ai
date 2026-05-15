package com.trustchain.monitor.network

import android.util.Log
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

object WebhookDispatcher {
    
    // Production Cloud Backend (Render)
    private const val BACKEND_URL = "https://trustchain-ai-j7rp.onrender.com/webhooks/new-message"
    private const val TAG = "TrustChainWebhook"

    fun dispatch(source: String, content: String, urls: List<String>) {
        thread {
            try {
                val url = URL(BACKEND_URL)
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "POST"
                connection.setRequestProperty("Content-Type", "application/json")
                connection.doOutput = true

                val jsonPayload = JSONObject().apply {
                    put("source", source)
                    put("content", content)
                    put("urls", urls)
                }

                val writer = OutputStreamWriter(connection.outputStream)
                writer.write(jsonPayload.toString())
                writer.flush()
                writer.close()

                val responseCode = connection.responseCode
                Log.d(TAG, "Webhook dispatched. Response Code: $responseCode")

                // If response comes back high severity, we trigger local AlertNotifier
                if (responseCode == 200) {
                    val responseStr = connection.inputStream.bufferedReader().use { it.readText() }
                    // E.g. trigger AlertNotifier.showThreatPopup(responseStr)
                }

            } catch (e: Exception) {
                Log.e(TAG, "Failed to dispatch webhook: ${e.message}")
            }
        }
    }
}
