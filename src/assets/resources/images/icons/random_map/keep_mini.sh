myString="mini"
for x in `find  ./`
    do if [[ -f $x && ! $x =~ $myString ]]
        then rm $x
    fi
done
