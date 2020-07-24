/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/expect.js/index.d.ts" />

import { HelloService } from "../src/hello-service.interface";
import HelloComponent from "../src/hello.component";

class MockHelloService implements HelloService {

    public sayHello(): string {
        return "Hello world!";
    }
}

describe("HelloComponent", () => {

    it("should say 'Hello world!'", () => {

        let mockHelloService = new MockHelloService();
        let helloComponent = new HelloComponent(mockHelloService);
   
        expect(helloComponent.sayHello()).to.be("Hello world!");
        expect(helloComponent.s()).to.be.ok; 
    });
});
   