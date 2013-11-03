# Dashboard Widgets

Under development.

## Available Widgets

- MechanicalClock : Simple clock with mechanical watch-look-alike hands movement. design borrowed from https://gist.github.com/janx/1188550. 

## Installation

Copy widget directory with .wdgt extension attached.
```
cp -R <directoryname> <directoryname>.wdgt
open <directoryname>.wdgt
```

## Widget APIs
### Clock APIs
Description TBA

- function TickGenerator(interval) : located in MechanicalClock/clock.js. 

  - .setInterval(interval) : Supports bps(beats per second), vps(vibrations per second), bpm, vpm, bph, vph, Hz units.
  - .addTickHandler(handler)
  - .removeTickHandler()
  - .getCurrentTickTime(date)
  - .tick(date)
  - .start()
  - .stop()

