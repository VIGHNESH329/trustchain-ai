package com.trustchain.monitor.ui

import android.app.AlertDialog
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.widget.Toast

object AlertNotifier {

    fun showThreatPopup(context: Context, threatDetails: String, riskLevel: String) {
        // Run on the main UI thread since webhooks run on a background thread
        Handler(Looper.getMainLooper()).post {
            val builder = AlertDialog.Builder(context)
            builder.setTitle("⚠️ $riskLevel RISK DETECTED")
            builder.setMessage("Trust Chain AI has intercepted a malicious payload.\n\nDetails: $threatDetails\n\nRecommendation: DO NOT CLICK any links. Block this sender immediately.")
            builder.setPositiveButton("Block & Delete") { dialog, _ ->
                // Integration with SMS/Contacts block APIs
                Toast.makeText(context, "Sender Blocked.", Toast.LENGTH_SHORT).show()
                dialog.dismiss()
            }
            builder.setNegativeButton("Ignore") { dialog, _ ->
                dialog.dismiss()
            }
            
            val dialog: AlertDialog = builder.create()
            dialog.show()

            // Styling for critical alerts
            if (riskLevel.equals("CRITICAL", ignoreCase = true) || riskLevel.equals("HIGH", ignoreCase = true)) {
                dialog.getButton(AlertDialog.BUTTON_POSITIVE).setTextColor(android.graphics.Color.RED)
            }
        }
    }
}
