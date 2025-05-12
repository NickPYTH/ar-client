export let host: string = `${document.location.protocol.slice(0, -1)}://${document.location.host.split(':')[0]}`

if (document.location.host.split(':')[1]) {
    if (document.location.host.split(':')[1] !== '3000')
        host += ':6868'
    else
        host += ':8000'
} else
    host += ''

//export let host:string = 'http://83.222.9.213:7788'