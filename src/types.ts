export type AppScreen =
  | 'SCREEN_1'           // Troubleshooting Results
  | 'DIAGNOSTIC_LOAD'    // Slower diagnostic progress bar
  | 'SCREEN_2'           // Diagnostics: "... Oh. It’s me."
  | 'SCREEN_3'           // Repair attempt: "REPAIR FAILED. The problem appears to be out of our hands."
  | 'SCREEN_4';          // Support Ticket Created (Instagram DM)
