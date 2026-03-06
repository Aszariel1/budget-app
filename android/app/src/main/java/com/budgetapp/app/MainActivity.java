package com.budgetapp.app;

import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.view.ViewTreeObserver;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private boolean isReady = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Set up a listener to keep the splash screen visible
        final View content = findViewById(android.R.id.content);
        content.getViewTreeObserver().addOnPreDrawListener(
            new ViewTreeObserver.OnPreDrawListener() {
                @Override
                public boolean onPreDraw() {
                    if (isReady) {
                        content.getViewTreeObserver().removeOnPreDrawListener(this);
                        return true;
                    }
                    return false;
                }
            }
        );

        // Keep splash screen for 2 seconds
        new Handler().postDelayed(() -> {
            isReady = true;
        }, 2000);
    }
}
