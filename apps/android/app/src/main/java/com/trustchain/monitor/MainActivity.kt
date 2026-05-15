package com.trustchain.monitor

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.TextView
import android.app.Activity

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Simple programmatic layout instead of XML for Phase 2 scaffolding
        val layout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(64, 64, 64, 64)
            gravity = android.view.Gravity.CENTER
        }

        val title = TextView(this).apply {
            text = "Trust Chain AI Monitor"
            textSize = 24f
            textAlignment = android.view.View.TEXT_ALIGNMENT_CENTER
            setPadding(0, 0, 0, 32)
        }

        val description = TextView(this).apply {
            text = "To enable autonomous threat protection, you must grant Trust Chain AI permission to read notifications so it can intercept SMS and WhatsApp messages before you click them."
            textSize = 16f
            textAlignment = android.view.View.TEXT_ALIGNMENT_CENTER
            setPadding(0, 0, 0, 64)
        }

        val btnEnable = Button(this).apply {
            text = "Enable Monitoring Service"
            setOnClickListener {
                startActivity(Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS))
            }
        }

        layout.addView(title)
        layout.addView(description)
        layout.addView(btnEnable)

        setContentView(layout)
    }
}
