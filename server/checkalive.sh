FILE=/opt/icontas/server/icontas.alive
if test -f "$FILE"; then
    rm $FILE
    else {
        npm start -prefix /opt/icontas/server/
    }
fi
