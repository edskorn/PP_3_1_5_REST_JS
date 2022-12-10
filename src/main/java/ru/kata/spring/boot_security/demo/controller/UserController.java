package ru.kata.spring.boot_security.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class UserController {

	@RequestMapping(value = "/login")
	public String login() {
		return "login";
	}

	@RequestMapping(value = {"/admin", "/user", "/"})
	public String showAll() {
		return "index";
	}
}