import { HelloService } from "./hello-service.interface";
export default class HelloComponent {
    private helloService;
    constructor(helloService: HelloService);
    sayHello(): string;
    s(): void;
}
