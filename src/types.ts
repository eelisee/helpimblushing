export type AppScreen =
  | 'SCREEN_1'              // Troubleshooting Results
  | 'DIAGNOSTIC_LOAD'       // Initial ~5.5s diagnostic load bar
  | 'SYSTEM_DIAGNOSTICS'    // "SYSTEM DIAGNOSTICS COMPLETE ... It’s you."
  | 'SYSTEM_FAILURE'        // "SYSTEM FAILURE" -> [ RELOAD ]
  | 'QUICK_RELOAD'          // Quick reload bar (~1.8s) -> back to SYSTEM_DIAGNOSTICS
  | 'SUPPORT_TICKET';       // "SUPPORT TICKET CREATED" with pre-set flirt message & Instagram
