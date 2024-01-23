# PlanningToolForWebsite

Files to be shared for Website

<!-- 09-08-2023 -->

1. When radios were from different family. The ant gain was not getting updated for the radio that was changed first.
   Rectified by updating the ant gain before the validation of radio family.
   Changes in functionalitiesptp.js in radio event listener in start.
2. The transmit power for ub22 and ubax were same 27
   Changes in functionalitiesptp.js in calcTx function.
   Changes in ptp.html all radio options has value as antgain,tx power.
   Changes in ptpeirpcalculate for maxtx.
