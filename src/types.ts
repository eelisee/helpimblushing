export type AppScreen =
  | 'SCREEN_1'              // Troubleshooting Results (with [ RUN DIAGNOSTICS ] and [ I'M TOO DRUNK FOR THIS ])
  | 'DIAGNOSTIC_LOAD'       // ~5.5s diagnostic load bar
  | 'SYSTEM_DIAGNOSTICS'    // "SYSTEM DIAGNOSTICS COMPLETE ... It’s you." -> [ I'D LIKE TO MEET THE DEVELOPER ]
  | 'SUPPORT_TICKET';       // "SUPPORT TICKET" with date flirt message & Instagram
