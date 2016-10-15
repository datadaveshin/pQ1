#!/bin/bash
paste tag-front-open station-list tag-front-close station-list tag-back | sed '1,$s/	//g' > station-list-tags

