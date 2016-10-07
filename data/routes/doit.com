#!/bin/csh

foreach i (x??)
    grep name $i >> toto
    grep station $i >> toto
    sed '1,$s/<name>//g' toto | sed '1,$s/<\/name>//g' | sed '1,$s/<station>//g' |  sed '1,$s/<\/station>//g' >> toto2 
    sed '1,$s/^/"/g' toto2 > toto3
    sed '1,$s/$/"/g' toto3 > $i.out
    rm toto* 
end


