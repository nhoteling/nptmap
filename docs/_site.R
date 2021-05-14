## packages I want loaded for all pages of my site
suppressPackageStartupMessages({
  library(ggplot2)
  library(dplyr)
  library(tidyr)
  library(reshape2)
  library(lubridate)
  
  library(ggridges)
  library(rgdal)
  library(raster)
  library(magick)    # image manipulations
  library(plotKML)   # Read the KML?
  library(rayshader) # elevation matrix stuff
  library(RcppRoll)  # smoothing ele profile for ridgeline
  library(sf)
  
  library(r2d3)
  library(jsonlite)
})

