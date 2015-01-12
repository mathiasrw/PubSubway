:: --compress is missing
call uglifyjs ./js/pubsubway.js         -o ./js/pubsubway.min.js         --source-map ./js/pubsubway.min.js.map
call npm test
pause