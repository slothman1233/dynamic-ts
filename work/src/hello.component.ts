import { HelloService } from "./hello-service.interface";
export default class HelloComponent {

    constructor(private helloService: HelloService) { }

    public sayHello(): string {

        return this.helloService.sayHello();
    }

    public s() {
        console.log(123)
    }

    public ss(){
        console.log(54545)
    }

 
}
