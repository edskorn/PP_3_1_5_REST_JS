package ru.kata.spring.boot_security.demo.exception_handling;

public class ErrorDTO {
    private String message;

    public ErrorDTO() {
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
